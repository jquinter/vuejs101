docker push us.gcr.io/dev-site-jq/iamodeler:beta
docker build --no-cache . -t iamodeler
docker tag iamodeler us.gcr.io/dev-site-jq/iamodeler:bet
docker push us.gcr.io/dev-site-jq/iamodeler:beta
#gcloud builds submit --tag us.gcr.io/dev-site-jq/iamodeler:beta .
gcloud beta run deploy iamodeler --image us.gcr.io/dev-site-jq/iamodeler:beta --platform managed --region us-central1