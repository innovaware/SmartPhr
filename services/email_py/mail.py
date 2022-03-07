# Import smtplib for the actual sending function
import smtplib
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
# Import the email modules we'll need
from email.message import EmailMessage

from paho.mqtt.client import Client

client = Client(client_id="mailerClient")

broker_mqtt = "localhost"
port_mqtt = 1883
username_mqtt = "test"
password_mqtt = "test"
topic_mqtt = "topic/dipendente"

smtp_server = "localhost"
smtp_port = 1025
sender_email = "my@gmail.com"


def on_connect(client, userdata, flags, rc):
    print("Connesso con successo")


def on_message(client, userdata, message):
    html = """\
            <html>
              <body>
                <p><b>Python Mail Test</b><br>
                   This is HTML email with attachment.<br>
                   Click on <a href="https://fedingo.com">Fedingo Resources</a>
                   for more python articles.
                </p>
              </body>
            </html>
            """

    info_dip = json.loads(message.payload.decode())
    with open('registrazione.html') as f:
        send_mail(info_dip[0], f.read())


def send_mail(info_dip, body):
    to_email = info_dip['email']

    message = MIMEMultipart()
    message['Subject'] = 'Smartphr - Registrazione'
    message['From'] = 'admin@localmail.com'
    message['To'] = to_email

    body_content = body.format(info_dip['nome'], info_dip['cognome'])
    message.attach(MIMEText(body_content, "html"))
    msg_body = message.as_string()

    server = smtplib.SMTP(smtp_server, smtp_port)
    # server.login(email, password)
    server.sendmail(sender_email, to_email, msg_body)
    #
    server.quit()


client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set(username_mqtt, password_mqtt)
client.connect(host=broker_mqtt, port=port_mqtt)

client.subscribe(topic=topic_mqtt)
client.loop_forever()
