#!/usr/bin/env bash

set -e
shopt -s nullglob
shopt -s globstar
shopt -s dotglob

# Load environment variables from .env file
export $(cat .env | xargs)

# Commands
BUNYAN=./node_modules/.bin/bunyan
WEBPACK=./node_modules/.bin/webpack
JADE=./node_modules/.bin/jade
BABEL=./node_modules/.bin/babel

# Helpers
shopt -s expand_aliases
alias b_log='echo "[$FUNCNAME]"'

clean() {
    rm -rf public dist
    b_log "Finished cleaning"
}

webpack() {
    type=${1:dev}
    b_log "Building webpack client bundle"
    $WEBPACK --progress --config "webpack.$type.config.js"
    b_log "Finished webpack"
}

views() {
    type=${1:dev}
    flags="${@:2}"

    case $type in
    dev)    output="public/"; is_dist="false" ;;
    dist)   output="dist/public/"; is_dist="true" ;;
    *)      b_log "Invalid view type $1" 1>&2; exit 1 ;;
    esac

    b_log "Compiling jade views"
    $JADE --obj "{
        locals: {
            dist: $is_dist
        }
    }" --out $output --hierarchy $flags ./app/views/
    b_log "Finished jade"
}

images() {
    mkdir -p "public"
    cp app/favicon.ico "public/"
    b_log "Copied images"
}

dist:babel() {
    b_log "Starting compiling server with Babel"
    babel "lib" --out-dir "dist/lib"
    b_log "Finished Babel"
}

dist:copy() {
    b_log "Copying assets and misc. files"
    mkdir -p ./dist/{public,lib}
    cp ./package.json ./app/misc/**/{*} ./dist/
    cp ./app/favicon.ico ./dist/public/
    cp ./lib/**/*.json ./dist/lib
    b_log "Finished copying"
}

dist:install() {
    b_log "Installing distribution dependencies"
    cd ./dist
    npm install --production --loglevel warn
    b_log "Finished installation"
}

dist() {
    b_log "Making distribution package"
    webpack dist &
    dist:babel &
    views dist &
    dist:copy
    wait
    dist:install
    b_log "Finished making distribution package"
}

build_dev() {
    webpack dev &
    views dev &
    images &
}

watch_dev() {
    images
    views dev -w &
}

run() {
    b_log "Running application"
    node . | $BUNYAN
}

run_watch() {
    run &
    watch_dev &
}

deploy() {
    b_log "Deploying sprinklers2"
    cd ./dist/
    rsync -Rcruvz --progress . "$DEPLOY_LOCATION"
    b_log "Finished deploying"
}

help() {
    cat << EOF
Command for building sprinklers2
Usage: $0 [command]

Commands:
    help        - Displays this message

    clean       - Removes all generated files
    webpack     - Compiles client side bundle for development using webpack
    views       - Compiles jade views
    views:watch - Compiles jade views and watches for changes
    images      - Copies images to the public directory

    dist:webpack - Compiles client side bundle for distribution using webpack
    dist:babel  - Compiles server code for distribution using Babel
    dist:copy   - Copies assets and misc. files for distribution
    dist:install - Installs dependencies for distribution
    dist        - Packages sprinklers2 for distribution in ./dist

    build_dev   - Builds sprinklers2 for development (webpack, views, images)
    watch_dev   - Builds sprinklers2 and watches for changes in development (views, images)
    run         - Runs sprinklers2 in development mode
    run_watch   - Runs sprinklers2 and watches for changes
    deploy      - Deploys sprinklers2 to the remote server specified in the environment or .env
EOF
}

case $1 in
clean)          clean ;;

webpack)        webpack dev ;;
views)          views dev ;;
views:watch)    views dev --watch ;;
images)         images ;;

dist:webpack)   webpack dist ;;
dist:babel)     dist:babel ;;
dist:copy)      dist:copy ;;
dist:install)   dist:install ;;
dist)           dist ;;

build_dev)      build_dev ;;
watch_dev)      watch_dev ;;
run)            run ;;
run_watch)      run_watch ;;
deploy)         deploy ;;

help)           help ;;
*)              echo "Command $1 not found. Run \"$0 help\" to see a list of commands" ;;
esac

wait