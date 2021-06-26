import { enc, dec } from "./aes";

describe("# Controller", function () {
  beforeAll(async (done) => {
    done();
  });

  afterAll((done) => {
    done();
  });

  it("should encrypt the text is 16 byte", function (done) {
    const txt = "0000066666aaaaa1";
    const enc_txt = "c23b4544398136a0dbf0ae90eb1d8ed2";
    expect(txt.length).toBe(16);
    expect(enc(txt)).toBe(enc_txt);
    done();
  }); //done

  it("should decrypt the text [0000066666aaaaa1] ", function (done) {
    const txt = "0000066666aaaaa1";
    const enc_txt = "c23b4544398136a0dbf0ae90eb1d8ed2";
    expect(dec(enc_txt)).toBe(txt);
    done();
  }); //done

  it("should encrypt the text is admin!23", function (done) {
    const txt = "admin!23";
    const enc_txt = "cb26cc3d8d44f9ca340e5f6b2231088d";
    expect(enc(txt)).toBe(enc_txt);
    done();
  }); //done

  it("should decrypt the text [admin!23] ", function (done) {
    const txt = "admin!23";
    const enc_txt = "cb26cc3d8d44f9ca340e5f6b2231088d";
    expect(dec(enc_txt)).toBe(txt);
    done();
  }); //done

  it("should encrypt the text is less 16 byte", function (done) {
    const txt = "000006666";
    const enc_txt = "bbca544762ed2023eb2de1ea9db3dda3";
    expect(txt.length).toBeLessThan(16);
    expect(enc(txt)).toBe(enc_txt);
    done();
  }); //done

  it("should decrypt the text [000006666] ", function (done) {
    const txt = "000006666";
    const enc_txt = "bbca544762ed2023eb2de1ea9db3dda3";
    expect(dec(enc_txt)).toBe(txt);
    done();
  }); //done

  it("should encrypt the text is more than 16 byte", function (done) {
    const txt = "0000066666aaaaa11111";
    const enc_txt =
      "c23b4544398136a0dbf0ae90eb1d8ed28d9061600c81029246a9b7485ec72598";
    expect(txt.length).toBeGreaterThan(16);
    expect(enc(txt)).toBe(enc_txt);
    done();
  }); //done

  it("should decrypt the text [0000066666aaaaa11111] ", function (done) {
    const txt = "0000066666aaaaa11111";
    const enc_txt =
      "c23b4544398136a0dbf0ae90eb1d8ed28d9061600c81029246a9b7485ec72598";
    expect(dec(enc_txt)).toBe(txt);
    done();
  }); //done
});
