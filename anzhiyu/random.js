var posts=["posts/1","posts/2","posts/3","posts/4","posts/0"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };