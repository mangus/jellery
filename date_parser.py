
import time
import datetime
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("input_date")
args = parser.parse_args()
print(int(time.mktime(datetime.datetime.strptime(args.input_date, "%c").timetuple())), end='')

