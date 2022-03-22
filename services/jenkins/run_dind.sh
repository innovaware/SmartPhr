
docker container run --name jenkins-docker \
        --restart always \
        --detach --privileged \
        --network jenkins --network-alias docker \
        --env DOCKER_TLS_CERTDIR=/certs \
        --volume jenkins-docker-certs-client:/certs/client \
        --volume jenkins-docker-certs-ca:/certs/ca \
        --volume jenkins-data:/var/jenkins_home \
        --publish 2376:2376 \
        docker:dind \
        --storage-driver overlay2