#!/bin/sh

counter=$((1))

pull () {
    printf "\033[%d;2;%d;%d;%dm\033[%d;2;%d;%d;%dm" 38 255 255 200 48 90 180 235
    echo "                                                                     "
    printf "\033[1A"
    echo "[$counter:] $1"
    printf "\033[0m"
    bmsetup pull modules/ $1
    counter=$(($counter+1))
}

pull base/anim_base/v01
pull base/elements_base/v01
pull base/http_base/v01
pull base/loadstat/v01
pull base/mods_base/v01
pull base/sysmod_box/v01

pull bmc/sites/v01
pull bmc/elem/v01

pull elem/flapbox/v01
pull elem/foot/v01
pull elem/loginbar/v01
pull elem/main/v01
pull elem/navbar/v01
pull elem/results_nav/v01
pull elem/treesel/v01
pull elem/treeselfill/v01

pull jstools/dfa/v01
pull jstools/dfa/parsers/webfw_varpars/v01
pull jstools/reader/v01

pull layouts/common/v01
pull layouts/elem/main/common/v01
pull layouts/elem/main/compact/v01
pull layouts/elem/foot/common/v01

pull layouts/page/panel/v01
pull layouts/page/stdsite/v01
pull layouts/page/minisite/v01

pull phptools/dfa/v01
pull phptools/dfa/parsers/varpars/v01
pull phptools/reader/v01

pull system/api/v01

pull custom/demo/common_all/v01
pull custom/demo/common_hyperlinks/v01
pull custom/demo/common_images/v01
pull custom/demo/common_pages/v01
pull custom/demo/email_texts/v01
pull sites/demo/v01
