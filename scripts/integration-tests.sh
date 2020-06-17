#!/bin/bash

source /scripts/common.sh
source /scripts/bootstrap-helm.sh


run_tests() {
    echo Running tests...

    wait_pod_ready test-case

    kubectl port-forward svc/test-case 3000 &

    yarn
    cd ./scripts/client
    yarn
    yarn start
}

teardown() {
    echo helm del
}

main(){
    if [ -z "$KEEP_W3F_LAB_TEST_CASE_NUMBER_OF_PEERS" ]; then
        trap teardown EXIT
    fi

    helm repo add w3f https://w3f.github.io/helm-charts/
    helm repo update

    helm install -f ./scripts/values/prometheus-operator.yaml \
         prometheus-operator stable/prometheus-operator

    helm install -f ./scripts/values/polkadot-base-services.yaml  \
         polkadot-base-services w3f/polkadot-base-services

    helm install -f ./scripts/values/polkadot.yaml \
         --set name=polkadot-1 \
         --set p2pPort=30333 \
         --set validator=true \
         --set extraArgs.validator="--alice" \
         --set nodeKey="0000000000000000000000000000000000000000000000000000000000000000" \
         polkadot-1 w3f/polkadot

    helm install -f ./scripts/values/polkadot.yaml \
         --set name=polkadot-2 \
         --set p2pPort=30334 \
         --set extraBootnodes[0]="/dns4/polkadot-1-p2p/tcp/30333/p2p/12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN" \
         polkadot-2 w3f/polkadot

    helm install -f ./scripts/values/polkadot.yaml \
         --set name=polkadot-3 \
         --set p2pPort=30335 \
         --set extraBootnodes[0]="/dns4/polkadot-1-p2p/tcp/30333/p2p/12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN" \
         polkadot-3 w3f/polkadot

    helm install -f ./scripts/values/polkadot.yaml \
         --set name=polkadot-4 \
         --set p2pPort=30336 \
         --set extraBootnodes[0]="/dns4/polkadot-1-p2p/tcp/30333/p2p/12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN" \
         polkadot-4 w3f/polkadot

    helm install --set port=3000 --set image.tag=${CIRCLE_SHA1} test-case ./charts/lab-test-case-number-of-peers

    run_tests
}

main
