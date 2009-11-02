<?php 

// simulate that this proccess might take a while so you can see the "please wait" in the select box.
sleep(1);

$stateID = $_GET['stateID'];
$countyID = $_GET['countyID'];
$townID = $_GET['townID'];

$states = array();
$states['MA'] = "Massachusetts";
$states['VT'] = "Vermont";

$counties = array();
$counties['MA']['BARN'] = 'Barnstable';
$counties['MA']['PLYM'] = 'Plymouth';
$counties['VT']['CHIT'] = 'Chittenden';

$towns = array();
$towns['MA']['BARN']['CHA'] = "Chatham";
$towns['MA']['BARN']['DEN'] = "Dennis";
$towns['MA']['BARN']['YAR'] = "Yarmouth";
$towns['VT']['CHIT']['BUR'] = "Burlington";
$towns['VT']['CHIT']['ESS'] = "Essex";

$villages = array();
$villages['MA']['BARN']['CHA']['CCHA'] = 'Chatham';
$villages['MA']['BARN']['CHA']['SCHA'] = 'South Chatham';
$villages['MA']['BARN']['CHA']['NCHA'] = 'North Chatham';
$villages['MA']['BARN']['CHA']['WCHA'] = 'West Chatham';
$villages['MA']['BARN']['CHA']['CHAP'] = 'Chatham Port';
$villages['MA']['BARN']['DEN']['CDEN'] = 'Dennis';
$villages['MA']['BARN']['DEN']['SDEN'] = 'South Dennis';
$villages['MA']['BARN']['DEN']['WDEN'] = 'West Dennis';
$villages['MA']['BARN']['DEN']['EDEN'] = 'East Dennis';
$villages['MA']['BARN']['DEN']['DENP'] = 'Dennis Port';
$villages['MA']['BARN']['YAR']['CYAR'] = 'Yarmouth';
$villages['MA']['BARN']['YAR']['SYAR'] = 'South Yarmouth';
$villages['MA']['BARN']['YAR']['WYAR'] = 'West Yarmouth';
$villages['MA']['BARN']['YAR']['BASS'] = 'Bass River';
$villages['MA']['BARN']['YAR']['YPOR'] = 'Yarmouth Port';
$villages['VT']['CHIT']['BUR']['BURL'] = 'Burlington';
$villages['VT']['CHIT']['BUR']['SBUR'] = 'South Burlington';
$villages['VT']['CHIT']['ESS']['ESSE'] = 'Essex';
$villages['VT']['CHIT']['ESS']['ESSJ'] = 'Essex Junction';
$villages['VT']['CHIT']['ESS']['JERI'] = 'Jerico';

if($stateID && !$countyID && !$townID){
	echo json_encode( $counties[$stateID] );
} elseif( $stateID && $countyID && !$townID ) {
	echo json_encode( $towns[$stateID][$countyID] );
} else {
	echo json_encode( $villages[$stateID][$countyID][$townID] );
}

?>


