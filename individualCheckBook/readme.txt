Javascript is only for demonstration, the actual script is already integrated with the spreadsheet.
One can copy the entire script and paste it to Google App Script if the script is somehow missing 
this script cannot work on its own as it uses Google App Script API.

to apply this script to its fullest potential, please make a copy of the following spreadsheet (linked below) to one's own drive.
https://docs.google.com/spreadsheets/d/12cQwuGz1lJq_fCUqpKk5f6Dx3yAHOJzuLcxe2l4N7kQ/edit?usp=sharing

for example:
    if Sahil owes you $100.12, put down sahil_100.12 at the note column (first letter is case insensitive)
    if you owe Sahil $90.12, put down sahil_-90.12 at the note column (first letter is also case insensitive)
    *one caveat: the name has to be only a single word due to the logic used, so one is suggested to use "camelCase" if there are several words in a name, eg. first name and last
the script will automatically aggregate the two and return $10 on the checkbook (page 2) spreadsheet.