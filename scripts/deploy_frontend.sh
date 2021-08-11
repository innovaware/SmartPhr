cd ../frontend/smartiphr
ng build --prod
docker build -t smartphr_frontend .

cd - 
	docker save smartphr_frontend | gzip > smartphr_frontend.tar.gz && \
	scp smartphr_frontend.tar.gz root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/smartphr_frontend.tar.gz 
	
echo "Enter to Server and lauch this command:
ssh root@vps-d76f9e1c.vps.ovh.net /root/smartphr/deploy.sh
"
