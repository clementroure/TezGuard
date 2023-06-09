import smartpy as sp

class Contract(sp.Contract):
def __init__(self):
  self.init_type(sp.TRecord(administrator = sp.TAddress, last_token_id = sp.TNat, ledger = sp.TBigMap(sp.TNat, sp.TAddress), metadata = sp.TBigMap(sp.TString, sp.TBytes), token_metadata = sp.TBigMap(sp.TNat, sp.TRecord(token_id = sp.TNat, token_info = sp.TMap(sp.TString, sp.TBytes)).layout(("token_id", "token_info")))).layout((("administrator", "last_token_id"), ("ledger", ("metadata", "token_metadata")))))
  self.init(administrator = sp.address('tz1gYdwegPS6XEdEv6g3ESwfUUyu7e4QBqv8'),
            last_token_id = 0,
            ledger = {},
            metadata = {'content' : sp.bytes('0x7b226e616d65223a202254657a4775617264222c20226465736372697074696f6e223a20224e46542075736564206173207065726d697369736f6e73227d')},
            token_metadata = {})


@sp.entry_point
def balance_of(self, params):
  sp.set_type(params, sp.TRecord(callback = sp.TContract(sp.TList(sp.TRecord(balance = sp.TNat, request = sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id"))).layout(("request", "balance")))), requests = sp.TList(sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id")))).layout(("requests", "callback")))
  sp.set_type(params.requests, sp.TList(sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id"))))
  def f_x0(_x0):
    sp.verify(self.data.token_metadata.contains(_x0.token_id), 'FA2_TOKEN_UNDEFINED')
    sp.result(sp.record(request = _x0, balance = sp.eif(self.data.ledger[_x0.token_id] == _x0.owner, 1, 0)))
  sp.transfer(params.requests.map(sp.build_lambda(f_x0)), sp.tez(0), params.callback)

@sp.entry_point
def burn(self, params):
  sp.set_type(params, sp.TList(sp.TRecord(amount = sp.TNat, from_ = sp.TAddress, token_id = sp.TNat).layout(("from_", ("token_id", "amount")))))
  sp.verify(False, 'FA2_TX_DENIED')
  sp.for action in params:
    sp.verify(self.data.token_metadata.contains(action.token_id), 'FA2_TOKEN_UNDEFINED')
    sp.if action.amount > 0:
      sp.verify((action.amount == 1) & (self.data.ledger[action.token_id] == action.from_), 'FA2_INSUFFICIENT_BALANCE')
      del self.data.ledger[action.token_id]
      del self.data.token_metadata[action.token_id]

@sp.entry_point
def mint(self, params):
  sp.set_type(params, sp.TList(sp.TRecord(metadata = sp.TMap(sp.TString, sp.TBytes), to_ = sp.TAddress).layout(("to_", "metadata"))))
  sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
  sp.for action in params:
    compute_fa2_lib_601 = sp.local("compute_fa2_lib_601", self.data.last_token_id)
    self.data.token_metadata[compute_fa2_lib_601.value] = sp.record(token_id = compute_fa2_lib_601.value, token_info = action.metadata)
    self.data.ledger[compute_fa2_lib_601.value] = action.to_
    self.data.last_token_id += 1

@sp.entry_point
def set_administrator(self, params):
  sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
  self.data.administrator = params

@sp.entry_point
def transfer(self, params):
  sp.set_type(params, sp.TList(sp.TRecord(from_ = sp.TAddress, txs = sp.TList(sp.TRecord(amount = sp.TNat, to_ = sp.TAddress, token_id = sp.TNat).layout(("to_", ("token_id", "amount"))))).layout(("from_", "txs"))))
  sp.failwith('FA2_TX_DENIED')

@sp.entry_point
def update_operators(self, params):
  sp.set_type(params, sp.TList(sp.TVariant(add_operator = sp.TRecord(operator = sp.TAddress, owner = sp.TAddress, token_id = sp.TNat).layout(("owner", ("operator", "token_id"))), remove_operator = sp.TRecord(operator = sp.TAddress, owner = sp.TAddress, token_id = sp.TNat).layout(("owner", ("operator", "token_id")))).layout(("add_operator", "remove_operator"))))
  sp.failwith('FA2_OPERATORS_UNSUPPORTED')