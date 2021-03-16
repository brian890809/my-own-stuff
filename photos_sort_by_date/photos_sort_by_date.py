import os 
import glob
import re 
import time
from pathlib import Path
from PIL import Image

regex = r"[A-Za-z0-9\-_]+\.[A-Za-z0-9]+"

# tree recursion? sort by year, then sort by month (recursively)
# check latest created file to determine which month to end
# create directories from starting month to ending moth  format: 2018_01
# move the files to the directory depending on their months
# print("Program ended, sorted [number] of files")

path = os.getcwd()
directories = os.listdir(path)

# move file directory constructor
def move_dir(year, month, directory):
	path = os.getcwd()
	year = str(int(year))
	month = str(int(month))
	time_year_month = "/" + year + "/" + month
	if os.path.exists("." + time_year_month):
		pass
	else:
		Path("." + time_year_month).mkdir(parents=True, exist_ok=True)
	os.rename(path + "/" + directory, path + time_year_month + "/" + directory)

# get metadata selector
def get_metadata(path):
	return Image.open(path).getexif()[36867]

# code main part
for k in directories:
	entry = re.search(regex, k);
	if entry is not None:		
		if entry.group(0) == os.path.basename(__file__):  # the script should skip itself
			pass
		else:	
			try:
				# top priority: get from metadata
				date = get_metadata(entry.group(0))
				year = date[:4]
				month = date[5:7]
				move_dir(year, month, entry.group(0))
			except:
				try:
					# second priority: parse file name
					assert len(entry.group(0).split("_")[1]) == 8
					date_str = entry.group(0).split("_")[1]
					year = date_str[:4]
					month = date_str[4:6]
					move_dir(year, month, entry.group(0))
				except:
					try: 
						# finally: look at modified date
						month = str(time.gmtime(os.path.getmtime(entry.group(0))).tm_mon)
						year = str(time.gmtime(os.path.getmtime(entry.group(0))).tm_year)
						move_dir(year, month, entry.group(0))
					except:
						x = entry.group(0)
						print("this file {} cannot be sorted, please sort on your own".format(x))
	else: 
		pass

print("done")
