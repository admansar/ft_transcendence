#!/bin/bash

print_tree()
{
    local dir="$1"
    local prefix="$2"

    for item in "$dir"/*
    do
        if [ -e "$item" ]
        then
            if [ -d "$item" ]
            then
                echo "${prefix} (dir) : $(basename "$item")"
                echo "$item"
                print_tree "$item" "$prefix    "
            elif [ -f "$item" ]; then
                echo "${prefix} (file) : $(basename "$item")"
                echo "${prefix}    |___ Contents:"
                cat "$item" | sed "s/^/${prefix}      /"
                echo
            fi
        fi
    done
}

print_tree "." ""
