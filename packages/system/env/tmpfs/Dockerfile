FROM centos:7
MAINTAINER David Worms

RUN \
    # Install Node dependencies
 && yum install -y git make && \
    # Install SSH and sudo
 && yum install -y openssh-server openssh-clients sudo && \
 && ssh-keygen -A

ADD ./entrypoint.sh /entrypoint.sh
RUN mkdir -p /nikita
WORKDIR /nikita/packages/system

# Sudo User
RUN useradd nikita -d /home/nikita \
 && mkdir -p /home/nikita \
 && chown nikita /home/nikita \
 && chmod 700 /home/nikita \
 && echo 'nikita ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/nikita
USER nikita

# Install Node.js
ENV NODE_VERSION stable
RUN curl -L https://git.io/n-install | bash -s -- -y
# Note, bashrc not sourced unless running interactively
# RUN . ~/.bashrc && n $NODE_VERSION
ENV PATH /home/nikita/n/bin:$PATH

RUN ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N '' \
 && cat ~/.ssh/id_ed25519.pub > ~/.ssh/authorized_keys

ENTRYPOINT ["/entrypoint.sh"]
