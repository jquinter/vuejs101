#!/bin/bash
usage(){
	echo "Usage: $0 APPNAME PROJECT_ID DEPLOY_REGION"
	exit 1
}
[[ $# -ne 3 ]] && usage

docker build --no-cache . -t $1
docker tag $1 us.gcr.io/$2/$1:beta
docker push us.gcr.io/$2/$1:beta
#gcloud builds submit --tag us.gcr.io/$2/$1:beta .
gcloud beta run deploy $1 --image us.gcr.io/$2/$1:beta --platform managed --region $3