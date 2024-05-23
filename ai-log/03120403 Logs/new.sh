#!/bin/bash

dir_name=03120403_$(date +"%Y_%m_%d_%I_%M_%p") 
mkdir "$dir_name"
touch "$dir_name"/prompts.txt
cp "../saas24a_questionnaire_template.json" ./"$dir_name"/template.json
