var sys = require('sys');
var Torrent = require('./torrent').Torrent;

var torrentFiles=process.argv.slice(2);
var torrents=[];

/* Create new torrent object for every torrent file */
for(i=0;i<torrentFiles.length;i++) {
	torrents.push(new Torrent(torrentFiles[i]));
}
