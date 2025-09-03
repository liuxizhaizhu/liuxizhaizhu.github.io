var posts=["posts/1","posts/2","posts/3","posts/0","posts/4"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };