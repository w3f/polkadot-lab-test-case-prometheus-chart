#!/bin/bash

source /scripts/common.sh
source /scripts/bootstrap-helm.sh

export WS_PORT=3000
export NODES=4

run_tests() {
    echo Running tests...

    wait_pod_ready test-case

    kubectl port-forward svc/test-case ${WS_PORT} &

    yarn
    cd ./scripts/client
    yarn
    yarn start
}

teardown() {
    echo helmfile del --purge
}

main(){
    if [ -z "$KEEP_W3F_POLKADOT_LAB_TEST_CASE_PROMETHEUS" ]; then
        trap teardown EXIT
    fi

    /scripts/build-helmfile.sh

    run_tests
}

main
