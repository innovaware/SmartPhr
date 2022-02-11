package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func printLogo() {

	fmt.Println("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
	fmt.Println("MMMMWXkddddddddddddddddddddddddddddddddddddddddddddddddddxONMMMMMMMMM")
	fmt.Println("MMMWO:,'';coooooooooooooooooooooooooooooooooooooooooool;'',c0WMMMMMMM")
	fmt.Println("MMMXl'co:;cdONWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN0xc;:l:'oNMMMMMMM")
	fmt.Println("MMMXl'dNXOo:,:dONWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWN0dc;;okXXl'oNMMMMMMM")
	fmt.Println("MMMXl'dWMMWXOo:,cdONWMMMMMMMMMMMMMMMMMMMMMMMWN0dc;:oOXWMMXl'oNMMMMMMM")
	fmt.Println("MMMXl'dWMMMMMWXOo:;:dONWMMMMMMMMMMMMMMMMMMNOd:;:oOXWMMMMMXl'oNMMMMMMM")
	fmt.Println("MMMXl'dWMMMMMMMMWXOo:;:dONWMMMMMMMMMMMWXOd:,:dOXWMMMMMMMMXl'oNMMMMMMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMWXOo:;:dONWMMMMMWXOo:;:dOXWMMMMMMMMMMMXl'oNMMMMMMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMWXOo:;:dOXX0Oo:;:dONWMMMMMMMWNXXKKK0l'oNMMMMMMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMWXOo:;:;,,cdONWMMMMMMWXOdoooooool:,cONMMMMMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMMMMWXOdxk0NMMMMMMMMW0oclxOKNWWWWNKOoccxXMMMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWKo:o0WWMMMWWWNWWMWXd;lKMMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMW0::OWMMWXOxolllllxXMNx,lXMM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM0::OWMMXxc:ok00Ol'cKMMXc,kWM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNo,xWMWKc,lKWMMMXl'xWMMNo,xWM")
	fmt.Println("MMMXl'dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMKc;OMMXl'lXMMMMWO;;0MMMNl,kWM")
	fmt.Println("MMMXl'oXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM0::0WM0:,kWMMMWKc'lXMMWO;cKMM")
	fmt.Println("MMMWk:,coodddooddddddddddddddddddddooodol,;kWMKc'lKNNXxl:,lXWXk:c0WMM")
	fmt.Println("MMMMWKkdoooooooooooooooooooooooooooooooooc,lXMW0l;:cllo0Ko;collxXWMMM")
	fmt.Println("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXo;lKWMNK00KXWMMNK00KNMMMMMM")
	fmt.Println("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNk::d0NWMMMMMMMWNWMMMMMMMMM")
	fmt.Println("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXklccodxkkkxdoo0WMMMMMMMM")
	fmt.Println("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWX0kxddddxk0KNMMMMMMMMM")
	fmt.Println("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
}

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())

	sendMailer(string(msg.Payload()))
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
}

func SetupCloseHandler(client mqtt.Client) {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		fmt.Println("\r- Ctrl+C pressed in Terminal")

		client.Disconnect(250)
		os.Exit(0)
	}()
}

func main() {
	fmt.Println("Mailer Service")
	// printLogo()
	var arg = ""

	fmt.Println("Len Args: ", len(os.Args))
	if len(os.Args) > 1 {
		arg = os.Args[1]
	}

	clientID := "go_mqtt_client" + arg
	fmt.Println("Client ID:", clientID)

	var broker = "localhost"
	var port = 1883
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s:%d", broker, port))
	opts.SetClientID(clientID)
	opts.SetUsername("test")
	opts.SetPassword("test")
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	// Setup our Ctrl+C handler
	SetupCloseHandler(client)

	fmt.Println("Arg", arg)
	if arg == "p" {
		publish(client)
	} else {
		sub(client)
		http.ListenAndServe(":8080", nil)
	}

	//http.HandleFunc("/", handler) // http://127.0.0.1:8080/Go

}

func publish(client mqtt.Client) {
	num := 100000
	for i := 0; i < num; i++ {
		text := fmt.Sprintf("Message %d", i)
		token := client.Publish("topic/test", 0, false, text)
		fmt.Println("Publish message index:", i)
		token.Wait()
		//time.Sleep(time.Second)
	}
}

func sub(client mqtt.Client) {
	topic := "topic/dipendente"
	token := client.Subscribe(topic, 1, nil)
	token.Wait()
	fmt.Printf("Subscribed to topic: %s\n", topic)
}
