#!/bin/bash
echo "开始"
#备份数据库
mysqldump -uroot -pdmkj_root cms_nest > e:/bak/sql/`mysql +%Y_%m_%d`.sql
echo '备份数据库完毕'
# 备份日志（将日志文件复制到备份数据库的文件夹里）
oldlog=e:/bak/web.log
newlog=e:/bak/sql/`date +%Y_%m_%d`.log
cp ${oldlog}  ${newlog}
echo "" > ${oldlog}
echo '备份日志完毕'
# 打包文件夹
#name= /home/wwwroot/`date +%Y_%m_%d_%H_%M_%s`.zip
#old= /home/wwwroot/bak
#zip -r ${name} ${old}
#echo '打包文件夹完毕'
# 发送邮件
#echo `date +%Y_%m_%d数据库备份` | mail -s `date +%Y_%m_%d备份邮件` -a  ${name} 你的邮箱@qq.com
#echo '发送邮件完毕'
#echo "全部完毕"
