import axios from 'axios';

export default {
    /**
     * 获取评论列表
     * @param {number} start - 起始评论索引
     * @param {number} limit - 每页显示的评论数量
     * @returns {Promise<{comments: Array, hasMore: boolean}>}
     */
    async getComments(start = 0, limit = 10) {
        try {
            const response = await axios.get('/api/comment/', {
                params: { start, limit }
            });
            return {
                comments: response.data.comments || [],
                hasMore: response.data.hasMore ?? (response.data.comments?.length >= limit)
            };
        } catch (error) {
            console.error('获取评论失败：', error);
            throw new Error(error.response?.data?.message || '获取评论失败');
        }
    },

    /**
     * 提交新评论
     * @param {Object} comment - 评论内容
     * @param {string} comment.content - 评论正文
     * @param {string} [comment.email] - 邮箱
     * @param {string} [comment.qq] - QQ号
     * @param {number} [comment.orid] - 回复的评论ID
     * @returns {Promise<Object>}
     */
    async postComment(comment) {
        try {
            const response = await axios.post('/api/comment/', comment);
            return response.data;
        } catch (error) {
            console.error('提交评论失败：', error);
            throw new Error(error.response?.data?.message || '提交评论失败');
        }
    }
};

// // 生成随机留言内容（测试用）
// const generateRandomMessage = (id) => {
//     const messages = [
//         `这是第 ${id} 条测试留言，用于检测分页加载功能。`,
//         `留言ID ${id}: 当页面滚动到底部时，应该自动加载下10条数据。`,
//         `测试内容 ${id} - `.repeat(5) + "检查长文本显示。",
//         `用户${id}说: 无限滚动功能测试中...`,
//         `分页测试 ${id}/100 - 确保每次加载10条且无重复数据。`
//     ];
//     return messages[id % messages.length];
// };

// const generateTestComments = () => {
//     console.log('生成测试数据...'); // 调试日志
//     return Array.from({ length: 100 }, (_, i) => {
//         const comment = {
//             id: i + 1,
//             content: generateRandomMessage(i + 1),
//             datetime: new Date(Date.now() - i * 600000).toISOString(),
//             parent: i > 10 && i % 5 === 0 ? Math.floor(Math.random() * 10) + 1 : null,
//             email: `user${i}@test.com`,
//             qq: i % 3 === 0 ? String(10000 + i) : null
//         };
//         console.log(`生成评论 ${comment.id}`, comment); // 调试日志
//         return comment;
//     });
// };

// const testComments = generateTestComments();
// console.log('总测试数据:', testComments.length); // 验证数据生成

// export default {
//     async getComments(start = 0, limit = 10) {
//         console.log(`[Mock] 请求参数: start=${start}, limit=${limit}`);
//         await new Promise(resolve => setTimeout(resolve, 800));
//         const slice = testComments.slice(start, start + limit);
//         console.log('[Mock] 返回数据:', slice.map(c => c.id));
//         return {
//             comments: slice,
//             hasMore: (start + limit) < testComments.length
//         };
//     },

//     async postComment(comment) {
//         console.log('[Mock] 提交评论:', comment);
//         const newComment = {
//             ...comment,
//             id: Date.now(),
//             datetime: new Date().toISOString()
//         };
//         testComments.unshift(newComment); // 添加到测试数据开头
//         return newComment;
//     }
// };