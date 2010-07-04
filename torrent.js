exports.Torrent = Torrent;

var fs = require('fs');
var sys = require('sys');
var path = require('path');

var Peer = require('./peer').Peer;
var bencode = require('./includes/bencode');

function Torrent(torrentFile) {
	this.torrentFile=torrentFile
	this.init();
}

Torrent.prototype = {
	
	/* Parse torrent file, set up any one-time shit */
	init: function() {
		/* Parse torrent file */
		this.metaInfoRaw=fs.readFileSync(this.torrentFile, 'binary');
		if(!this.metaInfoRaw) {
			sys.log('Error Reading torrent file '+this.torrentFile);
		} else {
			this.metaInfo=bencode.decode(this.metaInfoRaw);
			sys.log('Read Torrent File '+this.torrentFile+' - '+this.metaInfo.comment);
		}
		
		this.files=[];
		
		/* Get a list of filenames */
		if(typeof this.metaInfo.info.files != 'undefined') { // Multi-file torrets
			sys.log('Multi-file torrent');
			for(i=0;i<this.metaInfo.files.length;i++) {
				offsetCounter=0;
				file=this.metaInfo.info.files[i];
				this.files.push({
					name:file.path[file.path.length-1],
					path:path.join.apply(null, file.path),
					offset: offsetCounter,
					length: file.length,
					end: offsetCounter+file.length,
				});
				offsetCounter+=file.length;
			}
		} else {
			sys.log('Single file torrent');
			this.files.push({
				name:this.metaInfo.info.name,
				path:this.metaInfo.info.name,
				offset: 0,
				length: this.metaInfo.info.length,
				end: this.metaInfo.info.length,
			});
		}
		sys.log(JSON.stringify(this.files));
	},
	
	start: function() {
		// Connect to tracker, get peers, etc.
	}
}
