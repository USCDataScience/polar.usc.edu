#!/usr/bin/env bash

TOMCAT_HOME=/usr/local/polar/tomcat7;
TOMCAT_WEBAPPS=$TOMCAT_HOME/webapps
POLAR_HOME=/usr/local/polar/polar.usc.edu;

mvn package;
rm -r $TOMCAT_HOME/webapps/Polar;
cp $POLAR_HOME/target/Polar.war $TOMCAT_WEBAPPS/;
$TOMCAT_HOME/bin/shutdown.sh;
$TOMCAT_HOME/bin/startup.sh