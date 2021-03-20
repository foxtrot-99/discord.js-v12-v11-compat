const DJS12 = require('discord.js');
const BaseCollection = require('@discordjs/collection');
const { 
	BaseManager,	Collection,		Client,		Guild,
	TextChannel,
} = DJS12;

BaseCollection.prototype._find = BaseCollection.prototype.find;
BaseCollection.prototype.find = function find(a, b) {
	if(typeof a == 'function') return this._find(a);
	else return this._find(item => item[a] == b);
};

BaseCollection.prototype.exists = function exists(a, b) {
	return !!(this.some(item => item[a] == b));
};

BaseCollection.prototype.filterArray = function filterArray(fn, thisArg) {
	if(thisArg) fn = fn.bind(thisArg);
	return this.filter(fn).array();
};

BaseCollection.prototype.findAll = function findAll(a, b) {
	return this.filterArray(item => item[a] == b);
};

Guild.prototype.fetchMember = function fetchMember(id) {
	return this.members.fetch(id);
};

Guild.prototype.fetchMembers = function fetchMembers() {
	return this.members.fetch();
};

TextChannel.prototype.fetchMessage = function fetchMessage(id) {
	return this.messages.fetch(id);
};

TextChannel.prototype.fetchMessages = function fetchMessage(opt) {
	return this.messages.fetch(opt);
};

TextChannel.prototype.fetchPinnedMessages = function fetchPinnedMessages(id) {
	return this.messages.fetchPinned();
};

TextChannel.prototype.sendMessage = function sendMessage(msg) {
	return this.send(msg);
};

TextChannel.prototype.sendEmbed = function sendEmbed(embed, content, options) {
	if(!options && typeof content === 'object' && !(content instanceof Array)) {
		options = content;
		content = '';
	} else if (!options) {
		options = {};
	}
	return this.send(content, Object.assign(options, { embed }));
};

TextChannel.prototype.sendFiles = function sendFiles(files, content, options) {
	options = options || {};
	return this.send(content, Object.assign(options, { files }));
}

TextChannel.prototype.sendFile = function sendFile(attachment, name, content, options) {
	options = options || {};
	return this.send({ files: [{ attachment, name }], content, options });
}

Client.prototype.fetchUser = function fetchUser(...args) {
	return this.users.fetch(...args);
};

for(let cls of [Map, BaseCollection, Collection]) for(let fn of Object.getOwnPropertyNames(cls.prototype)) {
	if(fn == 'constructor') continue;
	
	const func = (function() {
		return this.cache[fn].apply(this.cache, arguments);
	});
	
	const gf = (function() {
		return this.cache[fn];
	});
	
	const sf = (function(val) {
		return this.cache[fn] = val;
	});
	
	const gt = cls.prototype.__lookupGetter__(fn), st = cls.prototype.__lookupSetter__(fn);
	
	if(gt) {
		try {
			Object.defineProperty(gf, 'name', { value: 'get ' + fn });
			BaseManager.prototype.__defineGetter__(fn, gf);
		} catch(e) { '둘리' }
	} if(st) {
		try {
			Object.defineProperty(sf, 'name', { value: 'set ' + fn });
			BaseManager.prototype.__defineSetter__(fn, sf);
		} catch(e) { '도우너' }
	} if(!gt && !st) {
		try { 
			Object.defineProperty(func, 'name', { value: fn });
			BaseManager.prototype[fn] = func;
		} catch(e) { '또치' }
	}
}

module.exports = true;
