cd ../frontend/smartiphr
ng build --prod
docker build -t smartphr_frontend .

cd ../scripts
docker save smartphr_frontend | gzip > smartphr_frontend.tar.gz
scp smartphr_frontend.tar.gz root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/smartphr_frontend.tar.gz


scp ../backend/Dockerfile root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend
scp ../backend/*.js root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend
scp ../backend/*.json root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend


ssh root@vps-d76f9e1c.vps.ovh.net deploy.sh