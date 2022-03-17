
docker container run --name jenkins-blueocean \
        --restart always \
        --detach \
        --network jenkins --network-alias docker \
        --env DOCKER_HOST=tcp://docker:2376 \
        --env DOCKER_CERT_PATH=/certs/client \
        --env DOCKER_TLS_VERIFY=1 \
        --publish 9080:8080 \
        --publish  50000:50000 \
        --volume jenkins-data:/var/jenkins_home \
        --volume jenkins-docker-certs-client:/certs/client:ro \
        jenkinsci/blueocean