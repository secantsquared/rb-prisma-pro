'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _getUserId = require('../utils/getUserId');var _getUserId2 = _interopRequireDefault(_getUserId);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

var Query = {
    posts: function posts(parent, args, _ref, info) {var prisma = _ref.prisma;
        var opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true } };


        if (args.query) {
            opArgs.where.OR = [
            {
                title_contains: args.query },


            {
                body_contains: args.query }];


        }
        return prisma.query.posts(opArgs, info);
    },

    myPosts: function myPosts(parent, args, _ref2, info) {var prisma = _ref2.prisma,request = _ref2.request;
        var userId = (0, _getUserId2.default)(request);
        var opArgs = {
            where: {
                first: args.first,
                skip: args.skip,
                after: args.after,
                orderBy: args.orderBy,
                author: {
                    id: userId } } };



        if (args.query) {
            opArgs.where.OR = [
            {
                title_contains: args.query },

            {
                body_contains: args.query }];


        }

        return prisma.query.posts(opArgs, info);
    },

    users: function users(parent, args, _ref3, info) {var prisma = _ref3.prisma;
        var opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy };

        if (args.query) {
            opArgs.where = {
                OR: [
                {
                    name_contains: args.query }] };



        }
        return prisma.query.users(opArgs, info);
    },

    comments: function comments(parent, args, _ref4, info) {var prisma = _ref4.prisma;
        var opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy };

        return prisma.query.comments(opArgs, info);
    },

    me: function () {var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref5, info) {var prisma = _ref5.prisma,request = _ref5.request;var userId, user;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                            userId = (0, _getUserId2.default)(request);_context.next = 3;return (
                                prisma.query.user(
                                {
                                    where: {
                                        id: userId } },


                                info));case 3:user = _context.sent;return _context.abrupt('return',


                            user);case 5:case 'end':return _context.stop();}}}, _callee, this);}));function me(_x, _x2, _x3, _x4) {return _ref6.apply(this, arguments);}return me;}(),


    post: function () {var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref7, info) {var prisma = _ref7.prisma,request = _ref7.request;var userId, posts, _posts, post;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                            userId = (0, _getUserId2.default)(request);_context2.next = 3;return (
                                prisma.query.posts(
                                {
                                    where: {
                                        id: args.id,
                                        OR: [
                                        {
                                            published: true },

                                        {
                                            author: {
                                                id: userId } }] } },





                                info));case 3:posts = _context2.sent;if (!(

                            posts.length === 0)) {_context2.next = 6;break;}throw (
                                new Error('Post not found.'));case 6:_posts = _slicedToArray(


                            posts, 1), post = _posts[0];return _context2.abrupt('return',
                            post);case 8:case 'end':return _context2.stop();}}}, _callee2, this);}));function post(_x5, _x6, _x7, _x8) {return _ref8.apply(this, arguments);}return post;}() };exports.



default = Query;