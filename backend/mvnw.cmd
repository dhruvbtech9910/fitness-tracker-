@echo off
set "LOCAL_MVN=C:\Users\DHRUV\.m2\wrapper\dists\apache-maven-3.9.9-bin\4nf9hui3q3djbarqar9g711ggc\apache-maven-3.9.9\bin\mvn.cmd"
if exist "%LOCAL_MVN%" (
    call "%LOCAL_MVN%" %*
) else (
    mvn %*
)
