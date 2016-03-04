#!/usr/bin/env python2.7
# encoding: utf-8

__author__ = 'almohsin@usc.edu'

import sys
import getopt
import os
import requests
import time

# ========= Config ========= #
DEFAULT_DIR = '/data/polar/'
DEFAULT_SOLR_URL = 'http://polar.usc.edu/solr/collection1/update/extract'
OPTIMIZE = True
OPTIMIZE_MAX_SEGMENTS = 1
# COMMIT_BATCH_SIZE = 1000

# ========= main() ========= #
def main(argv):
    #print(argv)
    inputDir = ''
    solrUrl = ''
    try:
        opts, args = getopt.getopt(argv,"hd:s:",["help", "dir=","solr="])
    except getopt.GetoptError:
        printUsage()
        sys.exit(2)

    if len(argv) != 4:
        if DEFAULT_DIR != '' and DEFAULT_SOLR_URL != '':
            inputDir = DEFAULT_DIR
            solrUrl = DEFAULT_SOLR_URL
        else:
            printUsage()
            exit()

    for opt, arg in opts:
       if opt in ("-d", "--help"):
           printUsage()
           sys.exit()
       elif opt in ("-d", "--dir"):
            inputDir = arg
       elif opt in ("-s", "--solr"):
            solrUrl = arg

    print 'inputDir =', inputDir
    print 'solrUrl =', solrUrl
    sys.stdout.flush()

    ### testing requests lib
    # r = requests.get('http://www.google.com')
    # print(r.text)
    #########################

    # fileList = getFileList(inputDir)
    fileList = []
    for root, directories, filenames in os.walk(inputDir):
        # for directory in directories:
        #     print os.path.join(root, directory)
        for filename in filenames:
            fileList.append(os.path.join(root, filename))
            print os.path.join(root, filename)
            sys.stdout.flush()

    # print(fileList)

    successCounter = 0
    errorCounter = 0

    print("Indexing ...")
    sys.stdout.flush()

    startTime = time.time()
    for filename in fileList:
        ## uncomment to test indexing few files
        #if successCounter > 10:
        #    break
        files = {'file': open(os.path.join(inputDir, filename), 'rb')}
        try:
            print("[{0}] indexing:\t{1}".format(successCounter, filename))
            r = requests.post(generateSolrPostUrl(solrUrl, inputDir, filename), files=files)
            if r.status_code == 200:
                successCounter += 1
            else:
                print("Error indexing {0}\n{1}".format(filename, r.text))
                errorCounter += 1
        except requests.exceptions.ConnectionError as err:
            print("----- Solr connection error:\n{0}".format(err))
            break

    print("Committing ...")
    r = requests.get(generateSolrCommitUrl(solrUrl))
    endTime = time.time()

    if r.status_code == 200:
        print("{0} files indexed and committed in {1}".format(successCounter, formatSeconds(endTime-startTime)))
        if errorCounter > 0:
            print("{0} errors encountered".format(errorCounter))
    else:
        print("Commit failed for indexing {0} files. Time spent: {1}".format(successCounter, formatSeconds(endTime-startTime)))

    if OPTIMIZE:
        print("Optimizing ...")
        r = requests.get(generateSolrOptimizeUrl(solrUrl))
        if r.status_code == 200:
            print("Solr core has been optimized.")
        else:
            print("Failed to optimize Solr core.")

# ========= Function to generate Solr Post URL ========= #
def generateSolrPostUrl(solrUrl, directory, filename):
    return "{0}?literal.id={1}".format(solrUrl, os.path.join(directory, filename))

# ========= Function to generate Solr Commit URL ========= #
def generateSolrCommitUrl(solrUrl):
    return "{0}?commit=true".format(solrUrl)

# ========= Function to generate Solr Optimize URL ========= #
def generateSolrOptimizeUrl(solrUrl):
    return "{0}?optimize=true&maxSegments={1}".format(solrUrl, OPTIMIZE_MAX_SEGMENTS)

# ========= print usage info ========= #
def printUsage():
    print('''
    Usage:  indexdirectory.py -d <directoryPath> -s <solrUpdateUrl>
    e.g.    indexdirectory.py -d /storage/filesToIndex -s http://localhost:8983/solr/core1/update/extract
    Or
    Usage:  indexdirectory.py --dir <directoryPath> --solr <solrUpdateUrl>
    e.g.    indexdirectory.py --dir /storage/filesToIndex --solr http://localhost:8983/solr/core1/update/extract

    Alternatively, you can set the arguments in config section in the code.
          ''')

# ========= get file list in a directory ========= #
def getFileList(directory):
    return os.listdir(directory)

# ======== function to format time difference into days & hh:mm:ss.ms ===== #
def formatSeconds(seconds):
    d = int(seconds / (60 * 60 * 24))
    h = int((seconds % (60 * 60 * 24)) / (60 * 60))
    m = int((seconds % (60 * 60)) / 60)
    s = seconds % 60.
    if d > 0:
        return "{} days & {}:{:>02}:{:>05.2f}".format(d, h, m, s)
    else:
        return "{}:{:>02}:{:>05.2f}".format(h, m, s)

# ========= call main() ========= #
if __name__ == "__main__":
   main(sys.argv[1:])
