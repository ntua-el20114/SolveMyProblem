#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <folder_to_zip> <output_zip_file>"
    exit 1
fi

# Assign the arguments to variables for better readability
folder_to_zip=$1
output_zip_file=$2

# Use the zip command to zip the folder
zip -r $output_zip_file $folder_to_zip