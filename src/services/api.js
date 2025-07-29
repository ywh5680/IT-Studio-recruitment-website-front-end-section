import axios from 'axios';

// 这是一个标准的辅助函数，用来从浏览器的 document.cookie 中解析出特定名称的 cookie 值
// 我们的后端框架（如Django）通常会把 CSRF Token 存在一个名为 'csrftoken' 的 cookie 里
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // 检查 cookie 字符串是否以我们需要的名称开头
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // --- 这是新增的核心逻辑 ---
        // 在发送请求之前，从 cookie 中获取 CSRF token
        const csrftoken = getCookie('csrftoken');

        // 如果获取到了 token，则将其设置到请求头中
        // 注意：只有在进行 'POST', 'PUT', 'DELETE' 等会修改数据的操作时，才需要 CSRF token
        // GET, HEAD, OPTIONS 等安全方法不需要。我们可以加一个判断。
        const method = config.method.toLowerCase();
        if (csrftoken && ['post', 'put', 'delete', 'patch'].includes(method)) {
            config.headers['X-CSRFToken'] = csrftoken;
        }
        // --- 新增逻辑结束 ---

        // 返回修改后的 config 对象，请求才会继续发送
        return config;
    },
    (error) => {
        // 处理请求错误
        alert("请求失败！");
        return Promise.reject(error);
    }
);

export default api;