document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById("posts-container");
    const loadingIndicator = document.getElementById("previous-loading");
    let page = 2; // Start from page 2 since the first page is loaded initially
    let loading = false;
    const currentPostId = window.currentPostId;

    const loadMorePosts = async () => {
        if (loading) return;
        loading = true;
        loadingIndicator.classList.remove('hidden');

        try {
            const response = await fetch(`/user/${currentPostId}?page=${page}&limit=10`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const contentType = response.headers.get('Content-Type');

            if (contentType && contentType.includes('application/json')) {
                const posts = await response.json();
                console.log('Received JSON data:', posts);

                if (posts.length > 0) {
                    posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'post mb-8 px-2 bg-zinc-900 rounded';
                        postElement.innerHTML = `
                            <div class="w-full flex items-center gap-2 justify-between">
                                <div class="w-full mb-2 flex items-center gap-2">
                                    <h1 class="text-xl">${post.username}</h1>
                                    <p class="text-gray-400">${new Date(post.createdAt).toLocaleString()}</p>
                                </div>
                                <p class="text-gray-400 px-2">
                                    <a href="/delete/${post._id}"><i class="ri-delete-bin-5-line"></i></a>
                                </p>
                            </div>

                            ${post.picture 
                                ? `<img src="/images/uploads/${post.picture}" alt="${post.caption}" class="w-full h-[50vh] object-cover object-center rounded-md">`
                                : `<img src="/images/uploads/default.png" alt="Default Image" class="w-full h-[50vh] object-cover object-center rounded-md">`}

                            <div class="flex gap-3 mt-2 text-2xl px-1">
                                ${post.like.indexOf(user._id) === -1
                                    ? `<i class="heart ri-heart-3-line"></i>`
                                    : `<i class="heart ri-heart-3-fill text-red-500"></i>`}
                                <i class="ri-chat-3-line"></i>
                                <i class="ri-share-circle-line"></i>
                            </div>
                            <h3 class="likeval px-1 text-sm leading-none tracking-tight">
                                ${post.like.length} likes
                            </h3>

                            <div class="w-full h-auto flex justify-between mt-2">
                                <p>${post.caption}</p>
                            </div>
                        `;
                        postsContainer.appendChild(postElement);
                    });
                    page++;
                } else {
                    window.removeEventListener('scroll', handleScroll);
                }
            } else {
                const text = await response.text();
                console.error('Unexpected content type. Expected JSON, got:', text);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            loadingIndicator.classList.add('hidden');
            loading = false;
        }
    };

    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 200
        ) {
            console.log("Triggering loadMorePosts");
            loadMorePosts();
        }
    };

    window.addEventListener("scroll", handleScroll);
});
