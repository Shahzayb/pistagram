const app = require('../index');
const supertest = require('supertest');

require('./util/db').setup();

const User = require('../model/user');
const Photo = require('../model/photo');
const Like = require('../model/like');
const Comment = require('../model/comment');

const { createToken } = require('../util/jwt');

const req = supertest(app);

describe('patch /api/photo/:photoId/like', () => {
  test('user can like a photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .patch(`/api/photo/${photo._id}/like`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.body.like.photoId.toString()).toBe(photo._id.toString());
    expect(res.body.like.userId.toString()).toBe(user._id.toString());
    expect(res.body.likeCount).toBe(1);

    done();
  });

  test('user cannot like already liked photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });
    const like = await Like.create({
      photoId: photo._id,
      userId: user._id
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .patch(`/api/photo/${like.photoId}/like`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(422);

    done();
  });
});

describe('patch /api/photo/:photoId/unlike', () => {
  test('user can unlike already liked photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });
    const like = await Like.create({
      photoId: photo._id,
      userId: user._id
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .patch(`/api/photo/${photo._id}/unlike`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(await Like.exists({ _id: like._id })).toBeFalsy();

    done();
  });

  test('user cannot unlike already unliked photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .patch(`/api/photo/${photo._id}/unlike`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(422);

    done();
  });
});

describe('get /api/photo/:photoId', () => {
  test('should get existing photo by id', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const res = await req.get(`/api/photo/${photo._id}`);

    expect(res.body._id).toBe(photo.id);

    done();
  });

  test('should not get photo by non-existing id', async done => {
    const res = await req.get(`/api/photo/sdjfsdfsfsdf`);

    expect(res.status).toBe(422);

    done();
  });
});

describe('POST /api/photo/:photoId/comment', () => {
  test('should post comment to an existing photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .post(`/api/photo/${photo._id}/comment`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ comment: 'noice' });

    const commentExists = await Comment.exists({ _id: res.body._id });

    expect(commentExists).toBe(true);

    done();
  });
});

describe('get /api/photo/:photoId/comment', () => {
  test('should get comments with pagination', async done => {
    const user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    const photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const comment1 = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment: 'noiceee'
    });

    const comment2 = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment: 'noiceeeeeee'
    });

    const res = await req.get(`/api/photo/${photo._id}/comment`).query({
      page: 1,
      size: 10
    });

    expect(res.body[0]._id).toBe(comment2.id);
    expect(res.body[1]._id).toBe(comment1.id);

    done();
  });

  test('should get no comments past valid page', async done => {
    const user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    const photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const comment1 = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment: 'noiceee'
    });

    const comment2 = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment: 'noiceeeeeee'
    });

    const res = await req.get(`/api/photo/${photo._id}/comment`).query({
      page: 5,
      size: 10
    });

    expect(res.body.length).toBe(0);

    done();
  });
});
