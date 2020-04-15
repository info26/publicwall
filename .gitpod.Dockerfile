FROM gitpod/workspace-full
USER gitpod
RUN sudo apt install git
RUN curl -s https://api.github.com/repos/cli/cli/releases/latest | grep browser_download_url | grep linux_amd64.deb | cut -d '"' -f 4 | wget -qi -
RUN sudo dpkg -i gh_*_linux_amd64.deb
#
# More information: https://www.gitpod.io/docs/config-docker/
