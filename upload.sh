#! /bin/sh
rsync --exclude '.*' -avhP . alex@192.168.1.30:/home/alex/sprinklers2
