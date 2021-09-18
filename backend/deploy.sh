tag=$(date '+%Y%m%d')

#scp *.json root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend
#scp *.js root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend
#scp -r ./models/*.js root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend/models
#scp -r ./routes/*.js root@vps-d76f9e1c.vps.ovh.net:/root/smartphr/backend/routes

echo "Build vps-d76f9e1c.vps.ovh.net:5000/backend"
docker build -t vps-d76f9e1c.vps.ovh.net:5000/backend .

echo "Push vps-d76f9e1c.vps.ovh.net:5000/backend"
docker push vps-d76f9e1c.vps.ovh.net:5000/backend

#echo "Run Deploy remote"
#ssh root@vps-d76f9e1c.vps.ovh.net "/root/smartphr/deploy_remote.sh ${tag}"
