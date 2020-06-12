#!/bin/bash

source /scripts/common.sh
source /scripts/bootstrap-helm.sh


run_tests() {
    echo Running tests...

    wait_pod_ready test-case
}

teardown() {
    helm del
}

main(){
    if [ -z "$KEEP_W3F_LAB_TEST_CASE_NUMBER_OF_PEERS" ]; then
        trap teardown EXIT
    fi

    helm install test-case ./charts/lab-test-case-number-of-peers

    run_tests
}

main
