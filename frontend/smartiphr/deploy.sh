date=$(date '+%Y%m%d')

ng build --prod

echo "BUILD Image"
docker build -t vps-d76f9e1c.vps.ovh.net:5000/frontend:${date} .

echo "PUSH Image"
docker push vps-d76f9e1c.vps.ovh.net:5000/frontend:${date}
