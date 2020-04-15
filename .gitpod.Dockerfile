FROM gitpod/workspace-full

USER gitpod

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
RUN sudo apt install git && curl https://github.com/cli/cli/releases/download/v0.6.4/gh_0.6.4_linux_amd64.deb -L && sudo dpkg -i gh_*_linux_amd64.deb \
 && pip3 install -r requirements.txt
#
# More information: https://www.gitpod.io/docs/config-docker/
