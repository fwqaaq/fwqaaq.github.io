// 模拟异步
function asyncFunc() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('fulfilled')
		}, 1000)
	})
}

function* coroutine() {
	yield asyncFunc()
	// 挂起恢复之后的代码
}

const it = coroutine()
it.next().value.then((value) => {
	console.log('value: ', value)
})

// 阻塞
for (let i = 0; i < 100; i++) {
	console.log(i)
}
