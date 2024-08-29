var express = require("express");
var router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("../models/user_Model");
const postModel = require("../models/post_Model");
const storyModel = require("../models/story_Model");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("../utils/multer");
const utils = require("../utils/utils");
const isLoggedIn = require("../middlewares/isLogedIn");

// GET main route.
router.get("/", function (req, res) {
  let user;
  res.render("index", { footer: false, user });
});

router.get("/login", function (req, res) {
  let user;
  res.render("login", { footer: false, user });
});

router.get("/like/:postid", async function (req, res) {
  const post = await postModel.findOne({ _id: req.params.postid });
  const user = await userModel.findOne({ username: req.session.passport.user });
  if (post.like.indexOf(user._id) === -1) {
    post.like.push(user._id);
  } else {
    post.like.splice(post.like.indexOf(user._id), 1);
  }
  await post.save();
  res.json(post);
});

router.get("/feed", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  let stories = await storyModel
    .find({ user: { $ne: user._id } })
    .populate("user");

  var uniq = {};
  var filtered = stories.filter((item) => {
    if (!uniq[item.user.id]) {
      uniq[item.user.id] = " ";
      return true;
    } else return false;
  });

  let posts = await postModel.find().populate("user");

  res.render("feed", {
    footer: true,
    user,
    posts,
    stories: filtered,
    dater: utils.formatRelativeTime,
  });
});

router.get("/profile", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts")
    .populate("saved");

  res.render("profile", { footer: true, user });
});

router.get("/profile/:user", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });

  if (user.username === req.params.user) {
    res.redirect("/profile");
  }

  let userprofile = await userModel
    .findOne({ username: req.params.user })
    .populate("posts");

  res.render("userprofile", { footer: true, userprofile, user });
});

router.get("/follow/:userid", isLoggedIn, async function (req, res) {
  let followKarneWaala = await userModel.findOne({
    username: req.session.passport.user,
  });

  let followHoneWaala = await userModel.findOne({ _id: req.params.userid });

  if (followKarneWaala.following.indexOf(followHoneWaala._id) !== -1) {
    let index = followKarneWaala.following.indexOf(followHoneWaala._id);
    followKarneWaala.following.splice(index, 1);

    let index2 = followHoneWaala.followers.indexOf(followKarneWaala._id);
    followHoneWaala.followers.splice(index2, 1);
  } else {
    followHoneWaala.followers.push(followKarneWaala._id);
    followKarneWaala.following.push(followHoneWaala._id);
  }

  await followHoneWaala.save();
  await followKarneWaala.save();

  res.redirect("back");
});

router.get("/search", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render("search", { footer: true, user });
});

router.get("/save/:postid", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });

  if (user.saved.indexOf(req.params.postid) === -1) {
    user.saved.push(req.params.postid);
  } else {
    var index = user.saved.indexOf(req.params.postid);
    user.saved.splice(index, 1);
  }
  await user.save();
  res.json(user);
});

router.get("/search/:user", isLoggedIn, async function (req, res) {
  const searchTerm = `^${req.params.user}`;
  const regex = new RegExp(searchTerm);

  let users = await userModel.find({ username: { $regex: regex } });

  res.json(users);
});

router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("edit", { footer: true, user });
});

router.get("/upload", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render("upload", { footer: true, user });
});

router.post("/update", isLoggedIn, async function (req, res) {
  const user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true }
  );
  req.login(user, function (err) {
    if (err) throw err;
    res.redirect("/profile");
  });
});

router.post("/post", isLoggedIn,
  upload.single("image"),
  async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    if (req.body.category === "post") {
      const post = await postModel.create({
        user: user._id,
        caption: req.body.caption,
        picture: req.file.filename,
      });
      user.posts.push(post._id);
    } else if (req.body.category === "story") {
      let story = await storyModel.create({
        story: req.file.filename,
        user: user._id,
        caption:req.body.caption,
      });
      user.stories.push(story._id);
    } else {
      res.send("tez mat chalo");
    }

    await user.save();
    res.redirect("/feed");
  }
);

router.post("/upload", isLoggedIn,
  upload.single("image"),
  async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.picture = req.file.filename;
    await user.save();
    res.redirect("/edit");
  }
);

// POST
router.post("/register", function (req, res) {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });

  userModel.register(user, req.body.password).then(function (registereduser) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});


// Route to get a single post and initial posts for infinite scroll
router.get("/user/:post", isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.post;
    const currentPost = await postModel.findById(postId).exec();
    const userId = currentPost.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await postModel.find({ user: userId, _id: { $ne: postId } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

        const user = await userModel.findById(userId).exec();
    // Check if it's an API request
    if (req.xhr || req.headers.accept.indexOf('application/json') > -1) {
      console.log("Route hit");
      
      return res.json({posts,user}); // Return JSON for AJAX request
    }

    // Otherwise, render the page normally
    res.render('viewpost.ejs', { 
        post: currentPost, 
        posts,
 
        user: user,
        footer: true,
        dater: utils.formatRelativeTime,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' }); // Return JSON error
  }
});


router.get("/delete/:id",isLoggedIn,async(req,res)=>{
  console.log(req.session.passport.user);
  
  await postModel.findOneAndDelete({_id:req.params.id});
  let user = await userModel.findOne({username:req.session.passport.user});
  console.log("User ",user);
  let idx= user.posts.indexOf(req.params.id);
  console.log("Index ",idx);
  user.posts.splice(idx,1);
  await user.save();
  res.redirect("/profile");
});

//User Followers Page
router.get("/followers/:user",isLoggedIn,async(req,res)=>{
  let id = req.params.user;
  let user1 = await userModel.findOne({_id:id});
  let users = await userModel.find({_id:{$in:user1.followers}});
  res.render("followers.ejs",{footer:true,user:req.user,users})
});

//User following Page
router.get("/following/:user",isLoggedIn,async(req,res)=>{
  let id = req.params.user;
  let user1 = await userModel.findOne({_id:id});
  let users = await userModel.find({_id:{$in:user1.following}});
  res.render("following.ejs",{footer:true,user:req.user,users})
});


router.get("/story",isLoggedIn,async(req,res)=>{
  let story  = await storyModel.find();
  dater: utils.formatRelativeTime
  res.render("story.ejs",{footer:true,user:req.user,story,dater: utils.formatRelativeTime})
})


module.exports = router;
