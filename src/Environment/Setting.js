var md5 = require('md5');
class Setting {
    /* global BigInt */
    A = BigInt('3781927463263421');
    C = BigInt('2113323684682149');
    lcrng(seedValue, length){
        let MOD = BigInt(Math.pow(10, length));
        let X = BigInt(seedValue);
        let lcr = (this.A * X + this.C) % MOD;
        let rid = lcr + '';
        while (rid.length < length) rid = 0 + rid;
        return rid;
    };
    md5Hash(sid , rid) {
        return md5(sid+rid);
    }

    setSecurity = (sid , time) => {
        let seedValue = time ;
        let rid = this.lcrng(seedValue , 16);
        let hash = this.md5Hash(sid , rid);
        return hash;
    };

}



export default Setting;