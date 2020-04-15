FROM gitpod/workspace-full

USER gitpod

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
RUN sudo apt install git
RUN curl -s https://api.github.com/repos/cli/cli/releases/latest
RUN grep browser_download_url
RUN grep linux_amd64
RUN cut -d '"' -f 4
RUN wget -qi -
RUN sudo dpkg -i gh_*_linux_amd64.deb
RUN pip3 install -r requirements.txt
#
# More information: https://www.gitpod.io/docs/config-docker/
