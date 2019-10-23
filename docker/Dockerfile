FROM php:7.2-apache-buster

# Install packages to download TeX live
# Install wget and install/updates certificates
RUN apt-get update \
   && apt-get install -yq --no-install-recommends \
      ca-certificates \
      wget \
      imagemagick \
      ghostscript \
      poppler-utils # for pdftops \
   && apt-get clean \
   && rm -r /var/lib/apt/lists/*

# Install TeX live
COPY texlive.profile /
WORKDIR /
RUN wget ftp://tug.org/historic/systems/texlive/2019/install-tl-unx.tar.gz \
  && tar xzvf install-tl-unx.tar.gz \
  && ./install-tl-*/install-tl -profile texlive.profile \
  && rm -rf install-tl-* \
  && rm texlive.profile

ENV PATH="/usr/local/texlive/2019/bin/x86_64-linux:${PATH}"
ENV TEXDIR=/usr/local/texlive/2019
ENV TEXMFCONFIG=~/.texlive2019/texmf-config
ENV TEXMFHOME=~/texmf
ENV TEXMFLOCAL=/usr/local/texlive/texmf-local
ENV TEXMFSYSCONFIG=/usr/local/texlive/2019/texmf-config
ENV TEXMFSYSVAR=/usr/local/texlive/2019/texmf-var
ENV TEXMFVAR=~/.texlive2019/texmf-var

# Install fonts
COPY fonts /usr/local/share/fonts
WORKDIR /usr/local/share/fonts
RUN autoinst --extra="-V --force" Versiculum.otf \
  && autoinst Crimson*.otf \
  && autoinst Fanwood*.otf \
  && autoinst Garamond*.otf \
  && autoinst GillSans*.otf \
  && autoinst IMFeDP*.otf \
  && autoinst IMFeEN*.otf \
  && autoinst IMFeFC*.otf \
  && autoinst IMFePI*.otf \
  && autoinst OFLGoudy*.otf \
  && autoinst ANTQUA*.TTF BKANT.TTF \
  && autoinst CONSTAN*.TTF \
  && autoinst MEINRADA.TTF \
  && autoinst Classical* \
  && autoinst Goudy* \
  && autoinst Cardo* \
  && texhash \
  && updmap-sys

RUN luaotfload-tool --update


# Install lilypond

# Copy application
COPY www /var/www/html/
