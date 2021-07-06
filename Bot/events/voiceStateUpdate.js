const {deleteVcJoin, setVcJoin, updateVcExp} = require('../../interfaces/vcInterface')
/**
 * Handles voice chat experience
 */
module.exports = async (client, oldState, newState) => {
	let newUserChannel = newState.channelID,
		oldUserChannel = oldState.channelID;

	if(!oldUserChannel && newUserChannel) { // User joined vc
		setVcJoin(newState.id, newState.member.guild.id, Date.now())
	} else if(!newUserChannel){ // User left vc
		/**
		 * This should hopefully not break
		 * when spammed as there is no delay
		 * if the member has been in the vc
		 * for less than one minute...
		 */
		await updateVcExp(oldState.id, oldState.member.guild.id)
		deleteVcJoin(oldState.id, oldState.member.guild.id)
	}
};