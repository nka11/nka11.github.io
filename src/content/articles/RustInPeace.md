# Rust In Peace

I want to maintain a Rust product, but it s hard to host on a lambda environment.

Here are some explorations on how to use rust on non rust hosting environment.

Constrains :
Environment : CPanel

Available techno : Phusion Passenger with python, nodejs or ruby, PHP

Advantages : ssh access to the host, cargo installation ok, linux system

Choice of the Rust Framework : Axum
https://chatgpt.com/share/68bf5176-bc50-800c-a4a6-8766776d1395


Bridging rust with python and wsgi => perfect with gunicorn, leads to deadlocks with PhusionPassenger.

https://github.com/Deepthought-Solutions/axum_wsgi/commit/40a294f04f780fb3514580cde809148ceb642b36

Bridging rust with nodejs
https://github.com/Deepthought-Solutions/axum_napi_bridge

Ultimate hack : Bridging rust with PHP

