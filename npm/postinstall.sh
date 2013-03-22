#!/bin/bash

#
# Marlin agent postinstall script: this is invoked after the Marlin package is
# installed to write out the SMF manifest and import the SMF service.  This is
# also invoked at build-time, but we don't do anything in that case.
#

if [[ -z "$npm_config_smfdir" || ! -d "$npm_config_smfdir" ]]; then
	echo "Skipping Marlin postinstall (assuming build-time install)"
	exit 0
fi

set -o xtrace
set -o pipefail
. $(dirname $0)/../tools/common.sh

mpi_smfdir=$npm_config_smfdir	 # directory where SMF manifests go (from apm)
mpi_version=$npm_package_version # package version (from apm)

#
# Copy the SMF manifest bundled with this package to a directory whose
# manifests will be imported on system boot.  We also replace a few useful
# tokens in the manifest here.
#
sed -e "s#@@PREFIX@@#$m_root#g" -e "s/@@VERSION@@/$mpi_version/g" \
    "$m_root/smf/manifests/marlin-agent.xml" > "$mpi_smfdir/marlin-agent.xml"

#
# Import the manifest to start the service.
#
svccfg import $mpi_smfdir/marlin-agent.xml
