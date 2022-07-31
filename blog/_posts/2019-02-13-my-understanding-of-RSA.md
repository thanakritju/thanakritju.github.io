---
layout:     post
title:      My CTF Journey, What is RSA and How to Break Vulnerable RSAs
tags:       [blog, writeup]
---

This article is about an RSA-related problem from picoCTF called “**Super Safe RSA**”. In SuperSafe RSA we intercept an encrypted message and retrieve some more information about the RSA parameters (which will be explained later) that were used to create the key. The problem provides information as follows.

```
c: 11088196587221862692269015178462414565206765106339440620686816517628928158754822
n: 24230166694711187941551255323020959293282718052334221740564929612586123885947819
e: 65537
```

For those who do not know RSA, RSA (Rivest–Shamir–Adleman) is a modern cryptographic tool which is widely used in software that transmits data over the internet.

RSA is an asymmetric cryptosystem, meaning that it uses pairs of keys : a public key which can be sent to others and a private key which needs to be kept privately.

For example, John and I want to talk to each other securely over the internet. We then generate a pair of keys (public and private) for each of us and exchange our public keys.

I use John’s public key to encrypt a text that I want to send to John and I know that only John who has the paired private key can decrypt it. John then decrypts the encrypted text and gets the plain text. John can send me back a message by using my public key to encrypt a text.

In this fashion, Mark who is a hacker that intercepts our messages can not interpret the messages because Mark does not have our private keys. That mainly is how data transmission works nowadays.

We can create our own public and private keys by generating 2 huge prime numbers **p** and **q** and multiply them together, we call the product **n**.

We calculate the [totient](https://en.wikipedia.org/wiki/Euler%27s_totient_function) of **n** `T(n)` by calculating `lcm(p-1,q-1)` or `(p-1)*(q-1)` if p and q are really big prime numbers.

We then pick e such that `1 < e < T(n)` and `gcd(n,e)=1` , the public key is `(n,e)`.

We can calculate `d*e = 1 (mod T(n))` or `d = (k*T(n)+1)/e (with no remainder)` for some integer **k**, and **d** is our private key! Your full private key is `(n,d)`.

To send a message, the person who needs to send a message **m** has to calculate `c = m^e (mod n)` which can then be decrypted by calculating `m = c^d (mod n)`

For example

```
1. p = 3, q =11
2. n = 33 (3 * 11)
3. T(n) = (3-1) * (11-1) = 20
4. pick e = 17 (1 < e < 20) and gcd(17,33) = 1
5. with k = 11 and d = (11*20+1)/17 = 13
6. message m = 9, c = 9^17 (mod 33) = 15
7. cipher c = 15, m = 15^13 (mod 33) = 9
```

Let’s get back to our challenge, **c** in the information is our cipher text , which is the term that is used to describe an encrypted text. **n** is our modulus **e** is also part of the public key. We basically got the public key and the encrypted message.

In the real world, **n** will be very big and cannot be factored to get **p** and **q** (if **n** could be factored, the cryptosystem would be vulnerable). However in this case we can use some online tools to factor **n**. I used [https://www.alpertron.com.ar/ECM.HTM](https://www.alpertron.com.ar/ECM.HTM) to factor it and managed to get these two primes:

```
c: 11088196587221862692269015178462414565206765106339440620686816517628928158754822
n: 24230166694711187941551255323020959293282718052334221740564929612586123885947819
e: 65537
p: 153561567462691443687583193642003689231 (39 digits)
q: 157787961500184797140745224882660195760549 (42 digits)
```

All we need to do now is to calculate **d**, I do this with python and I also need a Third-Party library called [gmpy2](https://gmpy2.readthedocs.io/en/latest/) which supports multiple-precision arithmetic, and also has an invert function that can calculate Modular multiplicative inverses. After that, the message can be decrypted using **c**, **d** and **n**:

```python
import gmpy2
c = 11088196587221862692269015178462414565206765106339440620686816517628928158754822
n = 24230166694711187941551255323020959293282718052334221740564929612586123885947819
e = 65537
p = 153561567462691443687583193642003689231
q = 157787961500184797140745224882660195760549
totient = (p-1)*(q-1)

# Modular multiplicative inverse
d = gmpy2.invert(e,totient)

# decrypt the message
m = pow(c,d,n)

print(hex(m)[2:])
```

We have now got the result which can be easily decoded:

```
7069636f4354467b7573335f6c40726733725f7072316d33245f353238327d
```

If you want a challenge, why don’t you decrypt this (hint: you need to find different methods):

```
n: 374159235470172130988938196520880526947952521620932362050308663243595788308583992120881359365258949723819911758198013202644666489247987314025169670926273213367237020188587742716017314320191350666762541039238241984934473188656610615918474673963331992408750047451253205158436452814354564283003696666945950908549197175404580533132142111356931324330631843602412540295482841975783884766801266552337129105407869020730226041538750535628619717708838029286366761470986056335230171148734027536820544543251801093230809186222940806718221638845816521738601843083746103374974120575519418797642878012234163709518203946599836959811
e: 3
c: 2205316413931134031046440767620541984801091216351222789180593875373829950860542792110364325728088504479780803714561464250589795961097670884274813261496112882580892020487261058118157619586156815531561455215290361274334977137261636930849125
```

Or this:

```
c: 79668267648075558841741892275291469986485547386666233810018570955348780031651951209258019070111906439629962480973363421930500372654794834747975674692309375138013228703075645537546688812778059823604600153327348389690881520188527530968233973893610336984081149546677650192824510618711918823381710276640601685243
n: 96275797980918882963345367043657421733340282534101148776014734564295712637727404923503716319734045420878507284484460090969525452246560250039670147052641196915510446061504061521391311722706595500157642514832855836250607945916753072930800994769587856028674884853559036747002666862364485439822793774845743934191
e: 52085916249011396834587688388237446709146177846546078261171222801038631418637759875608400839716348237524884481723011687831537824966874288194554903854287586643313203247128660760043305297541820351592720693986742682505608735361044661986345371523753538137903278162342007340840232199712836261504067981924786187265
```

### References
- https://picoctf.com/
- https://www.alpertron.com.ar/
- https://en.wikipedia.org/wiki/RSA_(cryptosystem)