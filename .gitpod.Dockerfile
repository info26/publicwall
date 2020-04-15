FROM gitpod/workspace-full

USER gitpod

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
RUN sudo apt install git && curl -s https://api.github.com/repos/mozilla/geckodriver/releases/latest \
  | grep browser_download_url \
  | grep linux64 \
  | cut -d '"' -f 4 \
  | wget -qi - -L && sudo dpkg -i gh_*_linux_amd64.deb \
 && pip3 install -r requirements.txt
#
# More information: https://www.gitpod.io/docs/config-docker/
