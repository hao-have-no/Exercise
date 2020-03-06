新版Angular8知识点纪录

####路由跳转携带参数(通过构建链接参数数组,来匹配定义好的路由列表)
定义好的路由:            {
                path: 'info/:id/:name',
                component: PatientInfoComponent
            },
            
具体业务跳转:
this.router.navigate(['info', this.selectedDiseaseId, selectedDisease.illnName])

####请求拦截器
return next.handle(newReq)
      .pipe(
        /*失败时重试2次*/
        retry(httpRetry),
        tap(response => {
          if (response instanceof HttpResponse) {
            if(this.environment.checkLogin && response.body && response.body.status == this.environment.status.notLogin) {
              this.message.warning("您尚未登录或登录已失效，请重新登录")
              this.router.navigate([this.environment.loginRouter || '/login'])
            }
          }
        }),
        /*捕获响应错误*/
        catchError(this.handleError.bind(this))
      )
      通过管道(pipe)对请求的过程进行处理
      retry:在发送失败的时候可以定义重新发送
      tap:对响应结果进行判断
      
#### ElementRef的作用---直接操作dom结构


