FROM node:6

# Install build-essential
RUN apt-get update -qq && apt-get install -y apt-utils
RUN apt-get install -y build-essential && npm install grunt-cli -g

WORKDIR /home/karma

# Set npm log level
ENV NPM_CONFIG_LOGLEVEL warn

# Install npm packages
RUN npm install karma mocha chai karma-mocha karma-chai karma-coverage karma-mocha-reporter

# Make everything available for start
COPY karma.conf.js /home/karma/karma.conf.js
COPY reproducer.js /home/karma/reproducer.js
COPY node_modules/karma-mocha-reporter /home/karma/node_modules/karma-mocha-reporter

# Set development environment as default
#ENV NODE_ENV development
#ENV DEBUG *

# Port 8090 for server
EXPOSE 9876
CMD ["node_modules/karma/bin/karma", "start", "karma.conf.js"]
