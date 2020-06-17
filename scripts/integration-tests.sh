#!/bin/bash

source /scripts/common.sh
source /scripts/bootstrap-helm.sh


run_tests() {
    echo Running tests...

    wait_pod_ready test-case
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

    helm install -f ./scripts/values/prometheus-operator.yaml prometheus-operator stable/prometheus-operator

    helm install -f ./scripts/values/polkadot-base-services.yaml  polkadot-base-services w3f/polkadot-base-services

    helm install -f ./scripts/values/polkadotyaml --set name=polkadot-1 --set p2pPort=30333 --set extraArgs.validator="--alice"  polkadot-1 w3f/polkadot
    helm install -f ./scripts/values/polkadotyaml --set name=polkadot-2 --set p2pPort=30334 --set extraArgs.validator="--bob"  polkadot-2 w3f/polkadot
    helm install -f ./scripts/values/polkadotyaml --set name=polkadot-3 --set p2pPort=30335 --set extraArgs.validator="--charly"  polkadot-3 w3f/polkadot
    helm install -f ./scripts/values/polkadotyaml --set name=polkadot-4 --set p2pPort=30336 --set extraArgs.validator="--dave"  polkadot-4 w3f/polkadot

    helm install test-case ./charts/lab-test-case-number-of-peers

    run_tests
}

main
